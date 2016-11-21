import {expect} from 'chai';

describe('document', function() {
    it('should be able to create div elements', function() {
        var div = document.createElement('div');
        expect(div.tagName).to.equal('DIV');
    });
});
