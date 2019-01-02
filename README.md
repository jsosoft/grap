<div><img class="alignnone size-full wp-image-141" alt="GRAP_small" src="http://www.jsosoft.com/dev/wp-content/uploads/2014/06/GRAP_small1.png" width="150" height="146" /></div>
<h3>GRAP: A Data-Driven Gaming Framework for HTML5</h3>
In the GRAP framework, all game characteristics are data-driven and managed in a single XML file. That means you can design an entire game with sprites, physics, collisions, animations, particles and emitters, 2D cameras and more all just by editing a simple XML data file that follows the MVC design pattern. Data driven programming frees you to develop and deliver ever more rapidly with ever more stable code; this is what the GRAP Framework offers.

...

GRAP uses a combination of metadata and the Model View Controller (MVC) design pattern to build a thin, flexible layer on top of existing open-source JavaScript frameworks. The code dependencies on these frameworks is extremely light.  HTML5 frameworks are in constant change and flux, not to mention many frameworks have uneven quality and spotty documentation; data driven techniques free you from depending too much on any one framework. GRAP is currently using <a title="Box2D.js" href="http://box2d-js.sourceforge.net/" target="_blank">Box2D.js</a>, a JavaScript port of the C++ engine Box2D, for physics and collision detection and <a title="KineticJS" href="http://kineticjs.com/" target="_blank">KineticJS</a> to simplify view rendering.  GRAP binds these frameworks together into a light layer on top driven entirely by data.
<h3>Simplify Game Design</h3>
In GRAP, Models and Views and their relationships (managed automatically through Controllers) are defined in the game data XML. Creating a new model or view type is as easy as defining its tag in an XML file. Actions, functions, events, timers, resources and more can be added just as easily.
<h3>Inheritable</h3>
The XML Model and View tags even include an inheritsFrom attribute.  This means that you can build entire inheritance chains right in the data.  Again, no code necessary.  Unless you want.   The Model, View and Controller JavaScript objects behave like proper Object-Oriented classes that can be extended in code as well!
<h3>Don't Repeat Yourself</h3>
One of the *great* advantages of GRAP is that if you do extend it, any new functionality is written once and only once and it is forever after available to you as data.
<h3>Extensible</h3>
Dynamic references can be defined in the XML data, so complex relationships can be established without coding.  In-line JavaScript functions are also allowed but they are compiled into functions on start-up so there are no runtime evals.  Additionally, GRAP follows the MVC design pattern so new classes can be easily added if existing functionality does not suit the developer's needs.
<h3>Demo</h3>
View a demonstration of some of the features in GRAP <a title="GRAP Demo" href="http://www.jsosoft.com/grap_demo/">here</a>.

...

The GRAP Framework was an experimental project, there are no plans for further development at this time.

View a demonstration of some of the features in GRAP at <a href="https://www.jsosoft.com/dev/grap-automated-gaming-framework/">https://www.jsosoft.com/dev/grap-automated-gaming-framework/</a>

For updates and currents regarding JSO Software's current projects please visit <a href="http://jsosoft.com/dev">http://jsosoft.com/dev</a>

<h3>Getting Started</h3>
<ul>
<li>Download the full <a href="https://github.com/somerj/GRAP/archive/master.zip">GitHub .zip file</a></li>
<li>Ensure that the library references in the <a href="https://github.com/somerj/GRAP/blob/master/src/index.htm">index.htm</a> file are maintained in that order</li>
<li>Ensure that there is a div tag where id="container" (already in index.htm) in your document body for the game to render
<li>Start editing the contained <a href="https://github.com/somerj/GRAP/blob/master/src/data/gameData.xml">gameData.xml</a> file right away to edit the included demo game!</li>
<li>Or replace that gameData.xml file with the blank one in the <a href="https://github.com/somerj/GRAP/tree/master/src/data_master">/data_master</a> directory to start a brand new game.</li>
</ul>

<h3>MIT License</h3>

© 2014 Jeremy Somer <jeremy@jsosoft.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
