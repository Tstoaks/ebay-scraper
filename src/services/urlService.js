import {shell} from "electron";

ngapp.service('urlService', function ($document) {
  let service = this;

  service.init = function () {
    $document.bind('click', function (event) {
      if (event.target.tagName !== 'A') return;
      if (!event.target.href) return;
      if (!event.target.href.startsWith('http')) return;
      shell.openItem(event.target.href);
      event.preventDefault();
    });
  };
});
