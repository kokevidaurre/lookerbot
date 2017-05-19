import QueryRunner from './query_runner';

export default class LookQueryRunner extends QueryRunner {

  lookId: number;
  filterInfo: any;
  loadedLook: any;

  constructor(replyContext, lookId, filterInfo = null) {
    super(replyContext, null);
    this.lookId = lookId;
    this.filterInfo = filterInfo;
  }

  showShareUrl() { return true; }

  linkText(shareUrl) {
    if (this.loadedLook) {
      return this.loadedLook.title;
    } else {
      return super.linkText(shareUrl);
    }
  }

  linkUrl(shareUrl) {
    if (this.loadedLook) {
      if (this.isFilteredLook()) {
        return this.filterInfo.url;
      } else {
        return `${this.replyContext.looker.url}${this.loadedLook.short_url}`;
      }
    } else {
      return super.linkUrl(shareUrl);
    }
  }

  isFilteredLook() {
    return (this.filterInfo != null) && (this.loadedLook.query.id !== this.filterInfo.queryId);
  }

  work() {
    return this.replyContext.looker.client.get(`looks/${this.lookId}`, (look) => {

      this.loadedLook = look;

      if (this.isFilteredLook()) {
        this.queryId = this.filterInfo.queryId;
      } else {
        this.querySlug = look.query.slug;
      }

      super.work();

    },
    r => this.replyError(r));
  }

}
