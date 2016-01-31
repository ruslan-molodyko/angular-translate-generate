# angular-translating-generate
Generate translate keys for angular file views

https://scotch.io/tutorials/internationalization-of-angularjs-applications

### Publish to npm and bower

https://viget.com/extend/publishing-packages-to-npm-and-bower

https://viget.com/extend/an-update-on-updating-npm-and-bower-packages

Config for generate keys

```

source: ['./public/index.html']
output: public/locales
locales:
  en:
    name: en_US
    format: raw
  ru:
    name: ru_RU
    format: translate
  ua:
    name: ua_UK
    format: translate
  
```

Config for generate view

```

source:
    ./public/index.html:
        selectors: [.main-container, title]
    ./public/index-save.html:

output: public
prefix: trans-

```

```

var YAML = require('yamljs'),
    TransKeys = require('./trans/generate_keys'),
    TransView = require('./trans/generate_view'),
    CONFIG = {};

CONFIG.pathToTransKeysConfig = 'config/transKeys.yaml';
CONFIG.pathToTransViewConfig = 'config/transView.yaml';

var configKeys = YAML.load(CONFIG.pathToTransKeysConfig),
    configView = YAML.load(CONFIG.pathToTransViewConfig);

var transKeys = new TransKeys(configKeys),
    transView = new TransView(configView);

transKeys.start();
transView.start();

```

##TODO
1. Add domain
2. Change translate via web interface
