# angular-translating-generate
Generate translate keys for angular file views

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


```
var YAML = require('yamljs'),
    Trans = require('./trans');

var CONFIG = {};
CONFIG.pathToTransConfig = 'config/trans.yaml';

var trans = new Trans(YAML.load(CONFIG.pathToTransConfig));
trans.start();
```

##TODO
1. Add domain
2. Change translate via web interface
