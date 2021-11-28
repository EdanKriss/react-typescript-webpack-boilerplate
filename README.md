# react-typescript-webpack-boilerplate
A React.js starter project. Uses webpack and ts-loader for transpilation, without babel.

Babel has long been a necessary evil for React devs who wished to use newer improvements to the javascript language.
Babel has allowed the use of features and syntax at a faster pace than browsers could implement them.
On good days, it simply elongated our build times, on bad days it was a compatibility nightmare.

For typescript users in particular, it has never been ideal to have separate packages for the build and type-checking steps.
For one, it adds additional effort to maintain compatibility/version between the two configurations.
It is also dangerous from a type safety perspective (unless you are meticulous with aligning the 2 configurations), because the output files are modified from the files that typescript is checking, in a way that is opaque to typescript.

Recent updates to typescript compiler and ts-loader have allowed this to be consolidated into a single step with acceptable bundle options, and with a stronger guarantee for type safety.
