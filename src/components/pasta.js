import React, { Component } from 'react';
import Infinite from 'react-infinite';
import Mui from 'material-ui';
//import {categories} from '../constants/categories';

const TextField = Mui.TextField;
const Slider = Mui.Slider;
const sliderStyle = {
  handle : {
    backgroundColor: '#fff'
  }
};

export default class Pasta extends Component {
  constructor(props) {
    super(props);
    this.props.initialize();
    // FIXME pass keyword list to this.props.feed.keywords
    // and rename this.props.feed.activeKeyword => feed.activeKeyword orb activeKeyword
    //for (const keyword of categories) {
      //this.props.fetchFeed(keyword.name);
    //}
    this.innerHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      this.innerHeight = document.documentElement.clientHeight;
      this.forceUpdate();
    }
  }

  onSliderChange(e) {
    console.dir(e.clientX);
  }
  onInfiniteLoad() {
    console.log("loading..")
    if (this.props.feed[this.props.feed.activeKeyword].isPageEnd) return;
    this.props.fetchFeed(this.props.feed);
  }

  elementInfiniteLoad() {
    return (
      <div className="rect-spinner"></div>
    );
  }

  getCategoryStyle(category) {
    switch (category) {
      case 'テクノロジー' :
        return {'backgroundColor':'#1ABC9C'};
      default :
        return {'backgroundColor':'#8E44AD'};
    }
  }
  // FIXME:
  unescapeHTML(str) {
    let div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/ /g, "&nbsp;")
        .replace(/\r/g, "&#13;")
        .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  }

  onClickKeyword(name) {
    console.log(name);
    this.props.onSelectKeyword(name);
    this.props.fetchFeed(this.props.feed);
  }

  getKeywordList() {
    console.dir(this.props.feed.keywords)
    return this.props.feed.keywords.map((keyword) => {
      const listClassName = keyword.name === this.props.feed.activeKeyword ? 'selected' : null;
      return (
          <li className={listClassName}
              key={keyword.name}
              onClick={this.onClickKeyword.bind(this, keyword.name)}>
          <i className={"fa fa-" + keyword.icon} />
          {keyword.name}
        </li>
      );
    });
  }

  render() {
    if (!this.props.feed.isInitialized) {
      return (
        <div className="rect-spinner"></div>
      );
    }

    const feed = this.props.feed[this.props.feed.activeKeyword];
    const items = feed.items.map((item) => {
      const favicon = 'http://cdn-ak.favicon.st-hatena.com/?url=' + encodeURIComponent(item.link);
      const hatebuHref = 'http://b.hatena.ne.jp/entry/' + encodeURIComponent(item.link);
      const hatebuImage = 'http://b.hatena.ne.jp/entry/image/' + item.link;
      return (
          <div className="item" key={item.link}>
            <img className="favicon" src={favicon} alt="favicon" />
            <a href={item.link} className="item-title">{item.title}</a>
            <a href={hatebuHref} className="hatebu"><img src={hatebuImage} alt="" /></a><br />
            <span className="publish-date">{item.publishedDate}</span>
            <span className="category" style={this.getCategoryStyle(item.categories[0])}>{item.categories[0]}</span>
              <p className="content-snippet">{this.unescapeHTML(item.contentSnippet)}</p>
          </div>
      );
    });
    return (
      <div id="container">
        <div id="side-menu">
          <img id="logo" src="img/logo.png" alt="" />
          <div className="slider">
            <Slider name="slider"
                    defaultValue={1}
                    onChange={this.onSliderChange.bind(this)}
                    max={250}
                    min={1}
                    style={sliderStyle} />
          </div>
          <div id="menu">
            <ul>
              <li onClick={this.onClickKeyword.bind(this, 'all')}><i className={"fa fa-home"} />総合</li>
              <li onClick={this.onClickKeyword.bind(this, 'favorite')}><i className={"fa fa-heart"} />お気に入り</li>
              {this.getKeywordList()}
            </ul>
          </div>
        </div>
        <div id="content">
            <Infinite
              elementHeight={140}
              containerHeight={this.innerHeight-40}
              infiniteLoadBeginBottomOffset={50}
              onInfiniteLoad={this.onInfiniteLoad.bind(this)}
              loadingSpinnerDelegate={this.elementInfiniteLoad()}
              isInfiniteLoading={feed.isInfiniteLoading}
              className={'items'}>
                {items}
            </Infinite>
        </div>
      </div>
    );
  }
}



