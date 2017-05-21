package roles

// Predefined roles with Level integer
type Role struct {
	Name string
	Level int
}

// Routes (pulled from the yaml file) with minimum Role needed to access it
type Route struct {
	Name string
	Role *Role
	Path string
}

