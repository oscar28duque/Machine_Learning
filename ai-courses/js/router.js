export class Router {
  constructor(routes = {}, defaultRoute = "home") {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this._boundHandleRoute = this._handleRoute.bind(this);
  }

  init() {
    window.addEventListener("hashchange", this._boundHandleRoute);
    window.addEventListener("load", this._boundHandleRoute);
  }

  navigate(route, param = null) {
    const target = param ? `#${route}/${param}` : `#${route}`;
    if (window.location.hash === target) {
      this._handleRoute();
      return;
    }
    window.location.hash = target;
  }

  _handleRoute() {
    const rawHash = window.location.hash.replace(/^#/, "");
    const [route, param] = rawHash.split("/");
    const safeRoute = route || this.defaultRoute;
    const renderer = this.routes[safeRoute] || this.routes[this.defaultRoute];
    this._updateActiveLink(safeRoute);
    renderer(param || null);
  }

  _updateActiveLink(route) {
    const links = document.querySelectorAll("[data-route]");
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
  }
}
