import * as angular from 'angular'
import { } from 'angular-mocks';
import { LoginModule } from './index'

describe('LoginPage', () => {

    let $componentController;

    beforeEach(() => {
        // load the login Module
        window['module'](LoginModule.name);
    });

    beforeEach(inject((_$componentController_) => {
        this.$componentController = _$componentController_;

    }));

    it('is registered', () => {
        // Extract the component controller from the login page
        const controller = this.$componentController('loginPage');

        expect(controller).toBeDefined();
    })

    it('has defined doLogin method', () => {
        const controller = this.$componentController('loginPage');

        expect(controller.doLogin).toBeDefined();
    })

    it('execute doLogin method', () => {
        const controller = this.$componentController('loginPage');
    
        expect(controller.doLogin('admin', 'test')).toBeDefined();
    })    
});
