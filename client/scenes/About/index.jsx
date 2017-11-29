import React from 'react';
import { Component } from 'react';

class About extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-5">
                        <h1>What is typitap?</h1>
                        <p>Typitap is an online typing game, where players can compete with each other and improve their typing skills.</p>
                        <p></p>
                        <h3 className="mt-4">Who am I?</h3>
                        <p>My name's Konrad and I've been developing typitap since October 2016. I'm a full-time web developer at The Drum, where primarily I code things in PHP and Javascript. In my spare time I build some side projects, and typitap is one of them.</p>
                        <p>Typitap has been built on a quite unusal stack. The game engine and server has been written in golang, and front-end is built with React.js.</p>
                        <p>Why typitap? I've finished a Game design course at Glasgow Caledonian University and building games always had been a great fun for me. I enjoy programming, but also a design part of creating games, so a web-based game seemed like a perfect fit for the next project.
                            I hope you enjoyed typitap - if you want to drop me a line, send some feedback or have some ideas to add to the game, feel free to let me know via e-mail or twitter.</p>


                        <p>~Konrad Jarosinski</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;