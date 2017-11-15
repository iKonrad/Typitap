package roles

import (
	"log"

	"strings"

	"github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/entities"
)

var roles []Role
var routes []Route

func init() {

	// Fetch roles and convert it to Role objects
	rls := config.Config.UMap("roles", map[string]interface{}{})
	for name, val := range rls {
		level := val.(int)
		newRole := Role{
			Name:  name,
			Level: level,
		}
		roles = append(roles, newRole)
	}

	// Fetch routes and convert it to Route objects
	rs := config.Routes.UMap("", map[string]interface{}{})
	for name, route := range rs {
		r := route.(map[string]interface{})
		if r["role"] != nil {
			if routeRole, ok := getRoleForString(r["role"].(string)); ok {
				newRoute := Route{
					Name: name,
					Path: r["path"].(string),
					Role: routeRole,
				}
				routes = append(routes, newRoute)
			} else {
				log.Println("Route '" + name + "' has role '" + r["role"].(string) + "' that doesn't exist")
			}
		}
	}
}

func getRoleForString(roleName string) (*Role, bool) {
	for _, role := range roles {
		if role.Name == roleName {
			return &role, true
		}
	}

	return &Role{}, false
}

func CanUserAccessURL(user *entities.User, url string) {
	CanRoleAccessURL(user.Role, url)
}

func CanRoleAccessURL(role string, url string) bool {

	// First, check if there's an address matching the provided URL
	route, ok := getRouteForPath(url)
	if !ok {
		return true
	}

	r, ok := getRoleForString(role)
	if !ok {
		return false
	}

	return route.Role.Level <= r.Level
}

func getRouteForPath(path string) (*Route, bool) {

	var r Route
	matchIndex := 0
	found := false

	for _, route := range routes {
		// Split paths by slash to get individual bits
		pathParts := strings.Split(path, "/")
		routeParts := strings.Split(route.Path, "/")

		// Check through all subpages of the path and check if the provided URL matches all of them
		var matching bool
		matching = true
		routeMatchIndex := 0

		for i, routePart := range routeParts {

			// Check if there's enough elements in this path
			if len(pathParts) < (i + 1) {
				matching = false
				break
			}

			// We need to omit the first, empty element
			if routePart == "" && pathParts[i] == "" {
				continue
			}

			if routePart != pathParts[i] {
				matching = false
				break
			} else {
				routeMatchIndex = i
			}

		}

		// If all path elements match, and the matchIndex is higher than the current one, replace the routeName
		// We're checking the matchIndex in order to prioritize more specific routes first
		if matching && (routeMatchIndex > matchIndex) {
			matchIndex = routeMatchIndex
			r = route
			found = true
		}
	}

	return &r, found
}
