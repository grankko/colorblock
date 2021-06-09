import { Context } from './Context.js';
import { GridViewModel } from './GridViewModel.js';
import { DetailsViewModel } from './DetailsViewModel.js';

class App {
  constructor() {
    this.context = new Context(this.initViewModels.bind(this));
    this.gridViewModel = new GridViewModel(this.context);
    this.detailsViewModel = new DetailsViewModel(this.context);

    this.detailsViewModel.onPixelBought = this.gridViewModel.drawPixels.bind(this.gridViewModel);
    this.gridViewModel.onPixelSelected = this.detailsViewModel.pixelSelected.bind(this.detailsViewModel);
  }

  initViewModels() {
    this.detailsViewModel.initView();
    this.gridViewModel.drawPixels();
  }
}

document.addEventListener('DOMContentLoaded', function () { 
  var app = new App();
});