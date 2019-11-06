# generator-brindille
Yeoman generator for brindille (static version)

## Installation
```
npm install -g brindille-generator
```

## Usage
Create a new Brindille project
```
yo brindille
```

Add a new brindille-component to your existing Brindille project. This will also add the proper imports to your `index.js`.
```
yo brindille:component
```


## Contributing
Clone the repository and from its directory use the following command, this will link the local copy of the folder as a global node module.

```
npm link
```

To revert the link operation:

```
npm unlink
```