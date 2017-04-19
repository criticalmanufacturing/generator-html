generator-html
========= 

**generator-html** is a set of scaffolding templates that enable CMF customization teams, partners and clients to easily start a new component, widget or page within Critical Manufacturing MES.

## Getting Started

To start using this generator, just install it to the root of your repository.

```
npm install generator-html --save-dev
```

After the installation is finished, run

```
yo html
```

This will ask you for your client prefix. This prefix is the starting name of all the packages of your solution.

## Available Templates

The available templates are:

### App

On the root of your package, just open a terminal and run:

```
yo html:app {appName}
```

### Component

On the root of your package, just open a terminal and run:

```
yo html:component {ComponentName}
```

### Converter

On the root of your package, just open a terminal and run:

```
yo html:converter {WidgetName}
```

### Data Source

On the root of your package, just open a terminal and run:

```
yo html:dataSource {DataSourceName}
```

### Directive

On the root of your package, just open a terminal and run:

```
yo html:directive {directiveName}
```

### Execution View

On the root of your package, just open a terminal and run:

```
yo html:executionView {ExecutionViewName}
```

### Framework

On the root of your package, just open a terminal and run:

```
yo html:framework {frameworkName}
```

### Package

On the root of your repository, just open a terminal and run:

```
yo html:package {PackageName}
```

The system will ask you if you want to add any dependencies to your package. You can use the cursor (UP/DOWN) and the SPACE bar to select/unselect multiple dependencies. After you are done just press ENTER. You can always add more dependencies in the future, by manually editing the ```__bower.json``` file of your package.

This will create a new CMF package, within ```src/packages```.

### Pipe

On the root of your package, just open a terminal and run:

```
yo html:pipe {pipeName}
```

### Widget

On the root of your package, just open a terminal and run:

```
yo html:widget {WidgetName}
```

### Wizard

On the root of your package, just open a terminal and run:

```
yo html:wizard {WizardName}
```