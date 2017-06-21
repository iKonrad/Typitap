// Code generated by go-bindata.
// sources:
// server/data/.DS_Store
// server/data/config/config.yml
// server/data/config/route_roles.yml
// server/data/countries/.DS_Store
// server/data/countries/geoip.csv
// server/data/countries/geoip.mmdb
// server/data/templates/react.html
// DO NOT EDIT!

package assets

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

// bindataRead reads the given file from disk. It returns an error on failure.
func bindataRead(path, name string) ([]byte, error) {
	buf, err := ioutil.ReadFile(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset %s at %s: %v", name, path, err)
	}
	return buf, err
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

// Ds_store reads file data from disk. It returns an error on failure.
func Ds_store() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/.DS_Store"
	name := ".DS_Store"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// configConfigYml reads file data from disk. It returns an error on failure.
func configConfigYml() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/config/config.yml"
	name := "config/config.yml"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// configRoute_rolesYml reads file data from disk. It returns an error on failure.
func configRoute_rolesYml() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/config/route_roles.yml"
	name := "config/route_roles.yml"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// countriesDs_store reads file data from disk. It returns an error on failure.
func countriesDs_store() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/countries/.DS_Store"
	name := "countries/.DS_Store"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// countriesGeoipCsv reads file data from disk. It returns an error on failure.
func countriesGeoipCsv() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/countries/geoip.csv"
	name := "countries/geoip.csv"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// countriesGeoipMmdb reads file data from disk. It returns an error on failure.
func countriesGeoipMmdb() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/countries/geoip.mmdb"
	name := "countries/geoip.mmdb"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// templatesReactHtml reads file data from disk. It returns an error on failure.
func templatesReactHtml() (*asset, error) {
	path := "/Users/konrad/Projects/Go/src/github.com/iKonrad/typitap/server/data/templates/react.html"
	name := "templates/react.html"
	bytes, err := bindataRead(path, name)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(path)
	if err != nil {
		err = fmt.Errorf("Error reading asset info %s at %s: %v", name, path, err)
	}

	a := &asset{bytes: bytes, info: fi}
	return a, err
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	".DS_Store": Ds_store,
	"config/config.yml": configConfigYml,
	"config/route_roles.yml": configRoute_rolesYml,
	"countries/.DS_Store": countriesDs_store,
	"countries/geoip.csv": countriesGeoipCsv,
	"countries/geoip.mmdb": countriesGeoipMmdb,
	"templates/react.html": templatesReactHtml,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}
var _bintree = &bintree{nil, map[string]*bintree{
	".DS_Store": &bintree{Ds_store, map[string]*bintree{}},
	"config": &bintree{nil, map[string]*bintree{
		"config.yml": &bintree{configConfigYml, map[string]*bintree{}},
		"route_roles.yml": &bintree{configRoute_rolesYml, map[string]*bintree{}},
	}},
	"countries": &bintree{nil, map[string]*bintree{
		".DS_Store": &bintree{countriesDs_store, map[string]*bintree{}},
		"geoip.csv": &bintree{countriesGeoipCsv, map[string]*bintree{}},
		"geoip.mmdb": &bintree{countriesGeoipMmdb, map[string]*bintree{}},
	}},
	"templates": &bintree{nil, map[string]*bintree{
		"react.html": &bintree{templatesReactHtml, map[string]*bintree{}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}

