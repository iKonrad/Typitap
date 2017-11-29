import React from 'react';

class StyleguideColors extends React.Component {
    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col mt-2">
                        <h2>Color Palette</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-3">
                        <h3>Main colors</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-2">
                        <div className="color-tile color-tile--light-shades"></div>
                        <div className="mt-4"><code>#F8F9F8</code></div>
                        <h5>Gray Nurse</h5>
                        <strong>Light Shades</strong>
                        <p>Use this color as the background for your dark-on-light designs, or the text color of an inverted design.</p>
                    </div>
                    <div className="col mt-2">
                        <div className="color-tile color-tile--primary"></div>
                        <div className="mt-4"><code>#64D88A</code></div>
                        <h5>Emerald</h5>
                        <strong>Main brand color</strong>
                        <p>This color should be eye-catching but not harsh. It can be liberally applied to your layout as its main identity.</p>
                    </div>
                    <div className="col mt-2">
                        <div className="color-tile color-tile--secondary"></div>
                        <div className="mt-4"><code>#FB8181</code></div>
                        <h5>Emerald</h5>
                        <strong>Light accent</strong>
                        <p>Accent colors can be used to bring attention to design elements by contrasting with the rest of the palette.</p>
                    </div>
                    <div className="col mt-2">
                        <div className="color-tile color-tile--dark-accent"></div>
                        <div className="mt-4"><code>#9883DE</code></div>
                        <h5>Blue Marguerite</h5>
                        <strong>Dark accent</strong>
                        <p>Another accent color to consider. Not all colors have to be used - sometimes a simple color scheme works best.</p>
                    </div>
                    <div className="col mt-2">
                        <div className="color-tile color-tile--dark-shades"></div>
                        <div className="mt-4"><code>#595489</code></div>
                        <h5>East bay</h5>
                        <strong>Dark Shades</strong>
                        <p>Use as the text color for dark-on-light designs, or as the background for inverted designs.</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col mt-3">
                        <h3>Form colors</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="color-tile color-tile--success"></div>
                        <div className="mt-4"><code>#f44336</code></div>
                        <h5>Success</h5>
                    </div>
                    <div className="col">
                        <div className="color-tile color-tile--danger"></div>
                        <div className="mt-4"><code>#FADE50</code></div>
                        <h5>Danger</h5>
                    </div>
                    <div className="col">
                        <div className="color-tile color-tile--info"></div>
                        <div className="mt-4"><code>#f44336</code></div>
                        <h5>Info</h5>
                    </div>
                    <div className="col">
                        <div className="color-tile color-tile--warning"></div>
                        <div className="mt-4"><code>#FADE50</code></div>
                        <h5>Warning</h5>
                    </div>
                </div>

                <div className="row">
                    <div className="col mt-3">
                        <p>Thanks <a href="http://colormind.io/bootstrap/" target="_blank">Colormind</a> for a great palette generator</p>
                    </div>
                </div>
            </div>

        );
    }
}

export default StyleguideColors;