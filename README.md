# Atum
Javascript Interpreter in Functional-Style Javascript

### About
Atum is a Javascript interpreter written in functional style Javascript. Atum is
designed to be a platform for Javascript experimentation and explores the
implementation and power of functional interpreters. It is part of Benben,
a project developing a complete Javascript implementation in functional style
Javascript.

### Project Goals
Atum is designed as a Javascript language testing and experimentation platform.
It also explores the functional implementation of imperative programming
languages. As an academic project, performance is a low priority (Atum may even
be the slowest Javascript implementation ever).

A few major project goals:
* Enable rapid prototyping and experimentation of the Javascript language.
* Support substantial hosted language alterations with minimal code changes.
* Functional style implementation.
* Modular code structure of composable functions.
* Minimal direct reliance on host language features.
* Support powerful debugging.


### Cloning

    git clone https://github.com/mattbierner/atum atum
    cd atum
    git submodule update --init

### Dependencies
Direct dependencies included in the project as submodules:

* [amulet][amulet] - Helper library for working with immutable objects
* [Nu][nu] - Functional streams
* [parse.js][parsejs] - Base combinatory parsing library
* [parse-ecma][parseecma] - Combinatory ECMAScript parser
* [ecma-ast][ecmaast] - ECMAScript AST nodes

### Resources
Indirect dependencies, used for testing or UI or some other supporting part of
the project. They are included as source files.

* [Require.js][requirejs] - Default AMD implementation used by Atum
* [jQuery][jquery] - Webpages
* [jQuery UI][jqueryui] - Console interface presentation
* [jQuery Layout][jquerylayout] - Console pane layout
* [CodeMirror][codemirror] - Console interface text editor
* [Knockout][knockout] - Console interface data layer
* [Qunit][qunit] - Unit testing

## Status
Atum is being actively developed and is not feature complete. Take a look at the
[issue tracker][atumissues] to see some features that are being worked on or
are not yet implemented.

## Contributing
Any contribution to atum is welcome. Some ideas to get started helping Atum:

* Run existing Javascript code in Atum and report issues.
* Implement Javascript builtins.
* Develop tools that take advantage of Atum's unique features.


## Project Highlights

### Computations
Atum is built from computations. A computation is a composable continuation based
step in a program, a function mapping the current state to a new state.
Computations are not used directly, but constructed with composable higher order
functions that abstract program operations. All of atum is basically built from
3 computations found in 'lib/atum/compute.js': just, bind, and callcc
(The concept behind Atums's computations is based on the continuation monad, but many
similarities between the two are only superficial given Atum's Javascript implementation).

From the set of base computations, Javascript language computations are 
define. Each computation encapsulates some part of program execution that
other computations can use.

### Support for Deep Language Alteration
Composed computations and minimal reliance on the host language allow
altering core language features and introducing new language features easily. For
example, try statements can be made transactional, with statements can be repurposed,
or objects can be passed by value with only few changes. Combined with parse-ecma,
new syntax can be introduced and implemented.

### State and Snapshots
The interpreted program's state is stored in a single immutable state object.
Copies of the state object can be easily created, allowing snapshots of program
state to be collected.

### Debugging
Atum's functional implementation and state snapshots enable novel debugging of
interpreted programs. This allows unique interaction with the code not possible
in traditional programming language implementations.

For example, with snapshots, a theoretical debugger could step through code not
only forwards, but also backwards and examine the events leading to the current
state. Further, the debugger can inject new states, creating branches in the
program's timeline that can be explored individually. The distinction between
writing, running, and debugging code disappears; programs becomes dynamic
documents programmers query, inspect, and change in real time.

More commonplace debugging tools also gain new power. Complex queries, conditional
breakpoints, event logging, and stepping are easily supported and can be
enhanced to take advantage of Atum's unique features.

A very simple debugger based on the Webkit inspector is included in Atum. This
was designed mainly to support development. Future projects will focus on
developing debuggers targeting Atum specifically.





[amulet]: http://github.com/mattbierner/amulet
[ecmaast]: http://github.com/mattbierner/ecma-ast
[parse]: http://github.com/mattbierner/parse.js
[parseecma]: http://github.com/mattbierner/parse-ecma
[nu]: http://github.com/mattbierner/nu

[requirejs]: http://requirejs.org
[jquery]: http://jquery.com
[jqueryui]: http://jqueryui.com
[jquerylayout]: http://archive.plugins.jquery.com/project/Layout
[codemirror]: http://codemirror.net
[knockout]: http://knockoutjs.com
[qunit]: http://qunitjs.com

[atumissues]: https://github.com/mattbierner/atum/issues
