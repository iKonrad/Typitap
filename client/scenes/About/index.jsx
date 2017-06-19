import React from 'react';
import { Component } from 'react';

class About extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 margin-top-5">
                        <h1>What is typitap?</h1>
                        <p><strong>typitap</strong> is an online typing game, where players can compete with each other by typing texts from the screen.</p>
                        <p></p>
                        <h3 className="margin-top-4">Who's behind it?</h3>
                        <p>My name's Konrad and I've been developing typitap since October 2016. I'm a full-time web developer at The Drum, where primarily I code things in PHP and Javascript. In my spare time I build some side projects, and typitap is one of them.</p>
                        <p>Typitap has been built on a quite unusal stack. The game engine and server has been written in golang, and front-end is built with React.js.</p>
                        <p><em>Why typitap?</em> I've finished a Game design course at Glasgow Caledonian University and building games always had been a great fun for me. With that said, typitap allowed me to explore new programming languages and utilize some skills that I've gained throughout my studies.</p>

                        <p>I hope you enjoyed the game - if you want to drop me a line, send some feedback or have some ideas to add to the game, feel free to let me know via my <a href="http://jarosinski.uk" target="_blank">homepage</a></p>
                        <p>Konrad Jarosinski</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;