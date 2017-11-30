import React from 'react';
// import Accordion from 'react-bootstrap/lib/Accordion';
// import Card from 'react-bootstrap/lib/Card';

class FAQ extends React.Component {
    constructor(props) {
        super(props);
    }

    static clientInit({tytestore, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div style={{paddingTop: "40px"}}>
                <div className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="banner__titles">
                                    <h1>Frequently Asked Questions</h1>
                                    <p>Can't find your question? <a href="mailto:konrad@jarosinski.uk">Let me know</a></p>
                                </div>
                                <div className="banner__content">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {/*<Accordion>*/}
                                {/*<Card header="What is typitap?" eventKey={1}>*/}
                                    {/*<p>*/}
                                        {/*Typitap is an online game where you can improve your typing skills while having fun.*/}
                                        {/*In typitap, you are given a text, and you need to type it in the text field as fast as you can.*/}
                                        {/*Then, when you finish, your score is calculated in <strong>words per minute</strong> (WPM).*/}
                                        {/*Typitap is online game, which means you can race with other players in real time.*/}
                                    {/*</p>*/}
                                {/*</Card>*/}
                                {/*<Card header="How is my score calculated?" eventKey={2}>*/}
                                    {/*<p>*/}
                                        {/*We show your score as words per minute. It's a universal and widely used measure to evaluate typing speed. However, due to the fact that words lengths vary, in typitap we combine the text into a single string and divide it in 5 characters words (average length of a word in English language).*/}
                                    {/*</p>*/}
                                    {/*<h5>Sounds good, but what's the point?</h5>*/}
                                    {/*<p>Okay, let's look at the 2 example texts below:</p>*/}
                                    {/*<ul>*/}
                                        {/*<li>This is my dog</li>*/}
                                        {/*<li>Healthy eating improves well-being</li>*/}
                                    {/*</ul>*/}
                                    {/*<p>Even though both of these sentences have 4 words, there's no doubt that the first sentence would take less time to type. However, in most typing games both sentences are treated the same due to the same number of words.</p>*/}
                                    {/*<p>In order to address this issue, we're combining the texts into a single string and divide it on 5 characters words, like so:</p>*/}

                                    {/*<ul>*/}
                                        {/*<li>Thisismydog - 11 characters: <strong>11 / 5 = 2 words</strong></li>*/}
                                        {/*<li>Healthyeatingimproveswell-being - 34 characters: <strong>34 / 5 = 6 words</strong></li>*/}
                                    {/*</ul>*/}
                                    {/*<p>As you can see, even though both texts have 4 words, the second one has more "weight" therefore is treated as a 6 words string.</p>*/}
                                {/*</Card>*/}
                                {/*<Card header="How is accuracy calculated?" eventKey={3}>*/}
                                    {/*<p>In typitap, we show accuracy as a percentage of words that you haven't made a typo for.</p>*/}
                                    {/*<p>For example, if you have a text:</p>*/}
                                    {/*<ul>*/}
                                        {/*<li>There's no such thing as a bad weather, only the wrong clothes.</li>*/}
                                    {/*</ul>*/}
                                    {/*<p>The text above has 12 words. Let's say you made a typo in 2 places, the game calculates your accuracy as follows:</p>*/}
                                    {/*<p><strong>100% - ((2/12) * 100) = ~83.4%</strong></p>*/}
                                {/*</Card>*/}
                                {/*<Card header="How can I contribute?" eventKey={4}>*/}
                                    {/*<p>By adding your own text to the game! To do so, click on your name (when you're logged in) and then select "Submit text". From there you can add texts from your favourite books (or your own).</p>*/}
                                    {/*<p>The text will then be reviewed and you will get an e-mail when it's approved and ready to play.</p>*/}
                                    {/*<p><a href="/submit-text" target="_blank">Submit text to typitap</a></p>*/}
                                {/*</Card>*/}
                                {/*<Card header="What's the 'follow' feature?" eventKey={5}>*/}
                                    {/*<p>You can follow other users and keep track on their activity. To do so, visit a user's profile and click on the "Follow" button next to their avatar.</p>*/}
                                    {/*<p>Then, on your dashboard you will see any activity made by that user.</p>*/}
                                {/*</Card>*/}
                                {/*<Card header="I can't see my progress chart" eventKey={6}>*/}
                                    {/*<p>That's most likely because there's not enough data to show.</p>*/}
                                    {/*<p>In order for the progress chart to show, you need to play for at least 3 consecutive days and your progress chart will show up.</p>*/}
                                {/*</Card>*/}
                                {/*<Card header="What are the benefits of signing up?" eventKey={7}>*/}
                                    {/*<ul>*/}
                                        {/*<li>You can have a custom username, as opposed to a default "guest" one</li>*/}
                                        {/*<li>All your results are saved and you can view your past games</li>*/}
                                        {/*<li>You can playback your past games</li>*/}
                                        {/*<li>You have access to progress charts</li>*/}
                                        {/*<li>You can follow other users and keep track on their activity</li>*/}
                                        {/*<li>People can leave comments on your dashboard</li>*/}
                                        {/*<li>You have access to your personal stats with average WPM, accuracy and trophies</li>*/}
                                    {/*</ul>*/}
                                {/*</Card>*/}
                            {/*</Accordion>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FAQ;