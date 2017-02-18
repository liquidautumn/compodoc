import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
//import * as helpers from 'handlebars-helpers';
import { HtmlEngineHelpers } from './html.engine.helpers';

export class HtmlEngine {
    cache: Object = {};
    constructor() {
        HtmlEngineHelpers.init();
    }
    init() {
        let partials = [
            'menu',
            'overview',
            'readme',
            'modules',
            'module',
            'components',
            'component',
            'component-detail',
            'directives',
            'directive',
            'injectables',
            'injectable',
            'pipes',
            'pipe',
            'classes',
            'class',
	        'interface',
            'routes',
            'search-results',
            'search-input',
            'link-type',
            'block-method',
            'block-enum',
            'block-property',
            'block-index',
            'block-constructor',
            'coverage-report',
            'miscellaneous'
        ],
            i = 0,
            len = partials.length,
            loop = (resolve, reject) => {
                if( i <= len-1) {
                    fs.readFile(path.resolve(__dirname + '/../src/templates/partials/' + partials[i] + '.hbs'), 'utf8', (err, data) => {
                        if (err) { reject(); }
                        Handlebars.registerPartial(partials[i], data);
                        i++;
                        loop(resolve, reject);
                    });
                } else {
                    resolve();
                }
            }


        return new Promise(function(resolve, reject) {
            loop(resolve, reject);
        });
    }
    render(mainData:any, page:any) {
        var o = mainData,
            that = this;
        Object.assign(o, page);
        return new Promise(function(resolve, reject) {
            if(that.cache['page']) {
                let template:any = Handlebars.compile(that.cache['page']),
                    result = template({
                        data: o
                    });
                resolve(result);
            } else {
                fs.readFile(path.resolve(__dirname + '/../src/templates/page.hbs'), 'utf8', (err, data) => {
                   if (err) {
                       reject('Error during index ' + page.name + ' generation');
                   } else {
                       that.cache['page'] = data;
                       let template:any = Handlebars.compile(data),
                           result = template({
                               data: o
                           });
                       resolve(result);
                   }
               });
            }

        });
    }
};
