CMF MES HTML Yoeman Generator
========= 

**generator-html** is a set of scaffolding templates that enable CMF customization teams, partners and clients to easily start a new component, widget or page within Critical Manufacturing MES.

## Getting Started

To start using this generator, just install it to the root of your repository.

```
npm install @criticalmanufacturing/generator-html --save-dev
```

After the installation is finished, run

```
yo @criticalmanufacturing/html
```

This will ask you for your client prefix. This prefix is the starting name of all the packages of your solution.

## Available Templates

The available templates are:

### App

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:app {appName}
```

### Component

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:component {ComponentName}
```

### Converter

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:converter {WidgetName}
```

### Data Source

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:dataSource {DataSourceName}
```

### Directive

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:directive {directiveName}
```

### Execution View

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:executionView {ExecutionViewName}
```

### Framework

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:framework {frameworkName}
```

### Package

On the root of your repository, just open a terminal and run:

```
yo @criticalmanufacturing/html:package {PackageName}
```

The system will ask you if you want to add any dependencies to your package. You can use the cursor (UP/DOWN) and the SPACE bar to select/unselect multiple dependencies. After you are done just press ENTER. You can always add more dependencies in the future, by manually editing the ```__bower.json``` file of your package.

This will create a new CMF package, within ```src/packages```.

### Pipe

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:pipe {pipeName}
```

### Widget

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:widget {WidgetName}
```

### Wizard

On the root of your package, just open a terminal and run:

```
yo @criticalmanufacturing/html:wizard {WizardName}
```

## Additional Information

This package was developed during the [UX-FAB: Universal Experience for Advanced Fabs](http://www.criticalmanufacturing.com/en/r-d/ux-fab) project.

![Portugal2020](http://www.criticalmanufacturing.com/uploads/richtext/images/2017030610420258bd3cfa033c0.png)