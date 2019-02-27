import React, { Component } from "react";
import './index.css';

class App extends Component {
  constructor(props){
  	super(props);
  	this.state = {posts:[]};
  }

  componentDidMount(){
  	var url = "https://www.reddit.com/.json";
  	var that = this;

  	// Retrieve/parse JSON data from URL and update state
  	fetch(url).then(function(response) {
  		if(response.status !== 200)
  			throw new Error("Bad response from server.");

  		return response.json();
  	})
  	.then(function(data){
  		var objArr = [];
  		var children = data.data.children;
  		var redditLink = "https://www.reddit.com/";

  		for(var i = 0; i < children.length; ++i){
  			var obj = {};

  			obj["id"] = i;
  			obj["subreddit"] = children[i].data.subreddit;
  			obj["ups"] = children[i].data.ups;
  			obj["title"] = children[i].data.title;
  			obj["image"] = children[i].data.url; // Didnt have time to resolve images that didn't load for some posts.
  			obj["url"] = redditLink + children[i].data.permalink;

  			// Convert UTC date into MM/DD/YYYY format
  			var d = new Date();
  			var date = d.toLocaleDateString(children[i].data.created);
  			obj["created_date"] = date;

  			objArr.push(obj);
  		}

  		that.setState({posts: objArr});
  	});
  }

  render() {
  	// Sort the posts in each subreddit by upvotes and group reddit posts by subreddit.
  	var posts = this.state.posts;
  	posts = posts.sort((a,b) => (a.ups > b.ups) ? -1 : 1);
  	posts = posts.reduce((subreddits, a) => {
  		if(!subreddits[a.subreddit])
  			subreddits[a.subreddit] = [];

  		subreddits[a.subreddit].push(a);
  		return subreddits;
  	}, {});

  	// Create elements for posts grouped by subreddit
  	const redditPosts = Object.keys(posts).map((item) => 
  		<div className="postOuterDiv" key={item}>
  		<h1>{item}</h1>
  		{
  			posts[item].map((p) => {
  				return(<div key={p.id}> 
  					<div className="postInnerDiv">
  						<img src={p.image}/>
  						<span>{p.created_date} &nbsp;&nbsp;&nbsp;&nbsp; {p.ups} Upvotes<br/><br/><a href={p.url}>{p.title}</a></span>
  					</div>
  				</div>);
  			})
  		}
  		</div>
  	);

    return (
    	<div className="mainDiv">{redditPosts}</div>
    )
  }
}

export default App;
