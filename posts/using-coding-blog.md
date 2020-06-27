> :Hero src=https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1900&h=600&fit=crop,
>       mode=light,
>       target=desktop,
>       leak=156px

> :Hero src=https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop,
>       mode=light,
>       target=mobile,
>       leak=96px

> :Hero src=https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1900&h=600&fit=crop,
>       mode=dark,
>       target=desktop,
>       leak=156px

> :Hero src=https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200&h=600&fit=crop,
>       mode=dark,
>       target=mobile,
>       leak=96px

> :Title shadow=0 0 8px black, color=white
>
> Using coding.blog

> :Author src=github

<br>

This blog post is being created using [CODEDOC](https://codedoc.cc/). And more specifically, it's being created in response to the activation of my hosted blog, https://eon.coding.blog. I've never used CODEDOC before and coding.blog is in an alpha stage at the moment, so I thought it would be interesting to give some first impressions on using them both.

<br>

## CODEDOC

CODEDOC is supposedly meant to be a tool for generating "beautiful and modern" software documentation. Like most static site generators these days, it's built on top of Markdown. You put your Markdown source content in a particular directory and _voila_, you have HTML. There are two primary differences between CODEDOC and other, similar, tools that I can tell thus far:

1. You use TypeScript files to create or modify themes and React for custom components.
2. You get a lot of out-of-the-box features that enhance the final output beyond what most others offer by default.

Some of those features include automatic support for light and dark versions of a theme, a "burger menu" for navigation, embedded per-page content navigation to jump around to different sections, and enhanced Markdown features.

I personally love TypeScript, so I think using TypeScript and React for custom components is great idea. However, I don't like it for theming. I would rather see something like Sass being used but I understand why they did it this way. It's not necessarily for me but it's ultimately a small thing. I _could_ get used to using TypeScript to create config maps for themes, I just don't want to because nothing else I do typically has that flow for generating styling assets.

I do **really like** the enhanced Markdown so far though. In other tools you typically get similar behavior by creating partial views and "rendering" them within another piece of content. In some tools you can't even do that: whatever you write in that file is all you get, for the most part, and you just have to be alright with duplicating components that can't go, or don't belong, in a layout template.

The installation process for CODEDOC, however, was fraught with complications for me.

## Node, NPM, Docker, and Windows

I'm not ashamed to say that I do a majority of my work on my Windows desktop PC. Docker is ubiquitous these days and I comfortably do all of my programming in containerized environments. And my setup for every project I work on is roughly the same at a high level:

- I have at least one Dockerfile that specifies the appropriate base image and installs any necessary program dependencies, such as `git` or `inotify-tools`. It also creates a "working directory" where my code/assets/whatever will reside.
- For simple setups, I have an executable that runs `winpty docker run -it -v {...} -p xxxx:xxxx <image> sh`. I use `-v` to bind mount my local working directory to the appropriate path inside the container. This allows me to work with assets on my Windows machine using my editor(s) of choice and have that work reflected inside the container.
- For more complex setups, I have a `docker-compose.yml` file and use `docker-compose up` to get a full stack running. Typically I do this when I need, e.g. a database in addition to my primary application. Then I use the `volumes` key in the compose config to bind mount my local working directory.

So far I've never had an issue with this flow. Until now.

For some reason, CODEDOC will not install properly when I use this flow. If I **do not** bind mount my local working directory to the container, then CODEDOC installs and runs successfully. But if I want to do that, I need to either rebuild my container with every change I want to preview - copying the files into the new container build - or somehow copy files from my local filesystem to the container's filesystem.

After some debugging, it seems NPM is likely the culprit. Even though I use NPM on almost all of my other (web-based) projects, I have never run into these errors before. But to test whether it was NPM specifically, or something else within the CODEDOC installation process, I did a bind mount while _excluding_ the `.codedoc/node_modules/` directory. And that worked. So long as the directory where NPM installs dependencies is not bound to my local filesystem, `npm install` will run successfully and then CODEDOC can be used without issue.

What does it look like to exclude a single directory for a bind mount volume? Like this:

```yaml
version: "3.8"
services:
  blog:
    build: .
    ports:
      - 3000:3000
    volumes:
      - ".:/home/blog"
      - "/home/blog/.codedoc/node_modules"
```

Notice that second volume entry. Typically, Docker wants two paths separated by a colon (`:`) with the first path being a local path and the second being a path within the container. If you **do not** specify two paths, and instead give it a single path, you can effectively "exclude" that path from being bind-mounted. It's not the most elegant solution but it's simple and it works.

So that's how I use CODEDOC for the foreseeable future. Not sure why that's a thing, but it is.

Personally, I blame CODEDOC for using Node. It's not a great language choice for most applications and I feel like this would have been significantly better as a Go or a Rust application. If you're going to use Node to create something it should be a client web application. Notice I said _client_, because even for server web applications there are significantly better technologies. But I love TypeScript, React, GraphQL, and a handful of other Node projects and I whole-heartedly think there's a good reason to use that technology. In the right situation. Requiring a Node developer environment to write some blog posts... not one of those situations.

And there's no need to remove all things JavaScript even if CODEDOC used something other than Node for its CLI program. For example, when I want to use [Bootstrap](https://getbootstrap.com/) or [Foundation for Sites](https://get.foundation/sites.html) I have choices around whether I just want the end-result because I'm alright with the defaults (typically JavaScript and CSS) or I want the source files so that I can customize and "compile" them myself (typically JavaScript and Sass). CODEDOC could have gone a similar route: allow people to either use "compiled" custom components and themes or use the source files to customize their output more minutely. Then developing custom components and themes is a separate issue from being able to generate "beautiful and modern" documentation. Separation of responsibilities.

## coding.blog

If you haven't seen it yet, although if you're here I'm assuming you have or will be soon, [coding.blog](https://coding.blog) is meant to be a blog platform for developers. It's a _blogging platform by developers, for developers, of developers_ kind of thing. The concept is simple enough: people are free to post and read content, but you can optionally pay a modest and transparent cost to received curated reading lists. Authors can receive tips through the platform, of which I assume coding.blog takes a small piece to at least cover transaction fees. I'm not sure how authors might profit from the curation side of things, if maybe they get a small payout whenever someone reads their content from a curated feed or if you are bound solely to tips. Although if you're using coding.blog as a way to make money, you're using the platform wrong; it's not designed for that.

You host your blog on a public git repo somewhere, anywhere. So long as it's a public git repo that coding.blog can clone, you can publish content. I think the simplest way to do that is with GitHub using a post-push action on the `master` branch. Then coding.blog receives a notification when your repo is updated, it grabs the latest version, generates your blog using CODEDOC, and finally publishes that for general viewing. It's simple and effective.

I'm not sure if I would consider replacing my personal blog for this. And, of course, there's an issue of posting to multiple destinations. If I maintain my own website with a blog as well as have this one and maybe also have an account with Medium where I like posting... how do you decide where content goes? I guess you could say "all things software go to coding.blog" but maybe I want some of that to go to my personal website, so how can I deploy that content to both sites? Does that even make sense to do? I don't have the answers to these questions yet; I'm still trying to figure it out.

## Initial Impressions

So far I don't dislike coding.blog or CODEDOC. I'm not a huge fan of everything it does and it's a **very** different way of doing blogs compared to what I'm familiar with. Hugo, Jekyll, and others... they have similar ways of accomplishing the same thing but it allows you to easily switch between them because of that. With CODEDOC you have such a significantly different approach that it's hard to simply switch.

Converting themes seems like it would be a massive pain. If you want to bring over your content that's easy enough but you'll have all of your newer content with all that awesome custom component stuff CODEDOC brings in and your older stuff won't have any of it. You might even have to edit your old content because you're trading front-matter configs for a completely different system that can, e.g., use the git author of a commit to determine who created a piece of content. It's cumbersome.

But are any of these things deal-breakers? Probably not. I think people will be more likely to only put new content on coding.blog and separate its purpose from any other blogs they might maintain. Which is probably the best approach, especially considering the early nature of the platform.

---

> :DarkLight
> > :InDark
> >
> > _Hero image by [Kaitlyn Baker](https://unsplash.com/@kaitlynbaker) from [Unsplash](https://unsplash.com)_
>
> > :InLight
> >
> > _Hero image by [Glenn Carstens-Peters](https://unsplash.com/@glenncarstenspeters) from [Unsplash](https://unsplash.com)_
