/**
 * Represents a simple navigation item for the main NavBar.
 */
export class NavItem {

  slug: string;
  title: string;

  constructor(slug: string, title: string) {
    this.slug = slug;
    this.title = title;
  }

}
