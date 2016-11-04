import { MadamScrapLivePage } from './app.po';

describe('madam-scrap-live App', function() {
  let page: MadamScrapLivePage;

  beforeEach(() => {
    page = new MadamScrapLivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
