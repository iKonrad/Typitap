package main

import (
	"html/template"
	"io"
	"net/http"
	"os"

	"github.com/elazarl/go-bindata-assetfs"
	"github.com/gorilla/websocket"

	"github.com/iKonrad/typitap/server/assets"
	configs "github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/cron"
	middlewares "github.com/iKonrad/typitap/server/middleware"
	"github.com/iKonrad/typitap/server/routes"
	"github.com/iKonrad/typitap/server/services/logs"
	ws "github.com/iKonrad/typitap/server/services/websocket"
	"github.com/itsjamie/go-bindata-templates"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/nu7hatch/gouuid"
	"github.com/olebedev/config"
	"golang.org/x/crypto/acme/autocert"
)

// App struct.
// There is no singleton anti-pattern,
// all variables defined locally inside
// this struct.
type App struct {
	Engine   *echo.Echo
	Conf     *config.Config
	Upgrader websocket.Upgrader
}

// NewApp returns initialized struct
// of main server application.
func NewApp(opts ...AppOptions) *App {
	options := AppOptions{}
	for _, i := range opts {
		options = i
		break
	}

	options.init()

	env := "dev"
	if os.Getenv("ENV") == "production" {
		env = "prod"
	}
	configs.Config.Set("env", env)

	// Parse config yaml string from ./conf.go
	conf, err := config.ParseYaml(confString)
	Must(err)

	// Set config variables delivered from main.go:11
	// Variables defined as ./conf.go:3
	conf.Set("debug", debug)
	conf.Set("commitHash", commitHash)

	// Parse environ variables for defined
	// in config constants
	conf.Env()

	// Make an engine
	engine := echo.New()

	engine.AutoTLSManager.Cache = autocert.DirCache("~/go/bin/.cache")

	// Use precompiled embedded templates
	engine.Renderer = NewTemplate()

	// Set up echo debug level
	engine.Debug = conf.UBool("debug")

	//engine.GET("/favicon.ico", func(c echo.Context) error {
	//	return c.Redirect(http.StatusMovedPermanently, "/images/favicon.ico")
	//})

	// Register authentication middleware
	engine.Use(middlewares.CheckAuthHandler)

	// Roles middleware
	engine.Use(middlewares.CheckRoleHandler)

	// Register Redux State generator middleware
	engine.Use(middlewares.GenerateStateHandler)

	engine.Static("/static", "static")


	if env == "prod" {
		engine.Use(middleware.GzipWithConfig(middleware.GzipConfig{
			Level: 6,
		}))
	}


	engine.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: `${method} | ${status} | ${uri} -> ${latency_human}` + "\n",
	}))

	// Initialize the application
	app := &App{
		Conf:   conf,
		Engine: engine,
	}

	middlewares.ReactJS = middlewares.NewReact(
		configs.Config.UString("duktape.path"),
		configs.Config.UBool("debug"),
		engine,
	)

	// Map app and uuid for every requests
	app.Engine.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("app", app)
			id, _ := uuid.NewV4()
			c.Set("uuid", id)
			return next(c)
		}
	})

	app.Upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	go ws.GetHub().Run()
	go ws.GetEngine().Run()

	//app.Engine.Use(authentication.Middleware.Handle);

	// Bind api hadling for URL api.prefix
	api := routes.AuthenticationAPIRoutes{}
	api.Bind(
		app.Engine.Group(
			"/api/auth",
		),
	)

	gameApi := routes.GameAPIRoutes{}
	gameApi.Bind(
		app.Engine.Group(
			"/api/game",
		),
	)

	userApi := routes.UserAPIRoutes{}
	userApi.Bind(
		app.Engine.Group(
			"/api/user",
		),
	)

	userAPIAdmin := routes.UserAPIAdminRoutes{}
	userAPIAdmin.Bind(
		app.Engine.Group(
			"/api/admin",
		),
	)

	authRoutes := routes.AuthenticationRoutes{}
	authRoutes.Bind(
		app.Engine.Group(
			"/auth",
		),
	)

	engine.GET("/ws", app.handleWebsocket)

	// Regular middlewares
	engine.Use(middleware.Recover())

	// Create file http server from bindata
	fileServerHandler := http.FileServer(&assetfs.AssetFS{
		Asset:     assets.Asset,
		AssetDir:  assets.AssetDir,
		AssetInfo: assets.AssetInfo,
	})

	// Set up authentication module

	// Serve static via bindata and handle via react app
	// in case when static file was not found
	app.Engine.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// execute echo handlers chain
			err := next(c)
			// if page(handler) for url/method not found
			if err != nil {
				httpErr, ok := err.(*echo.HTTPError)
				if ok && httpErr.Code == http.StatusNotFound {
					// check if file exists
					// omit first `/`
					if _, err := assets.Asset(c.Request().URL.Path[1:]); err == nil {
						fileServerHandler.ServeHTTP(
							c.Response().Writer,
							c.Request())
						return nil
					}
					// if static file not found handle request via react application
					return middlewares.ReactJS.Handle(c)
					//return NoJsRender(c);
				}
			}
			// Move further if err is not `Not Found`
			return err
		}
	})

	logs.Log("App Started", "Typitap App has started", []string{"server"}, "Server")
	cron.RunJobs()
	return app
}

func NoJsRender(c echo.Context) error {

	response := map[string]interface{}{
		"uuid":  c.Get("uuid").(*uuid.UUID).String(),
		"title": "TYPITAP TEST",
		"meta":  "my meta tags to add at the head of the page",
	}

	return c.Render(http.StatusOK, "react.html", response)
}

// Run runs the app
func (app *App) Run() {
	if configs.Config.UString("env") == "prod" {
		Must(app.Engine.StartAutoTLS(":" + "443"))
	} else {
		Must(app.Engine.Start(":" + configs.Config.UString("app_port")))
	}

}

func (app *App) handleWebsocket(c echo.Context) error {
	ws.ServeWs(c)
	return nil
}

// Template is custom renderer for Echo, to render html from bindata
type Template struct {
	templates *template.Template
}

// NewTemplate creates a new template
func NewTemplate() *Template {
	return &Template{
		templates: binhtml.New(assets.Asset, assets.AssetDir).MustLoadDirectory("templates"),
	}
}

// Render renders template
func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {

	return t.templates.ExecuteTemplate(w, name, data)
}

// AppOptions is options struct
type AppOptions struct{}

func (ao *AppOptions) init() {
	/* write your own*/
}
