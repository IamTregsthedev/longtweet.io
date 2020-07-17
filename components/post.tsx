import React from 'react';
import { UserProvider } from '../components/user';
import Header from '../components/header';
import Footer from '../components/footer';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('default', {
  linkify: true,
});

interface Props {
  title: string;
  text: string;
  user: string;
  handle: string;
  postId: string;
  createdDate: string;
}

function Post({ title, text, user, postId, createdDate, handle }: Props) {
  return (
    <UserProvider>
      <Header />
      <main className="container">
        <div
          id="author-controls"
          className="author-controls caption"
          data-user={user.toString()}
          data-post-id={postId}
          style={{ display: 'none' }}
        >
          <div className="row">
            <div className="author-controls__description">
              <span role="img" aria-label="wave">
                👋
              </span>{' '}
              This is your post.
            </div>
          </div>
          <p className="author-controls__instructions">
            Anyone with this link will be able to view your post here forever.
          </p>
          <p>
            Press <strong>Tweet</strong> to share it on Twitter.
          </p>
          <div className="row">
            <button id="delete" className="author-controls__delete-it button">
              Delete
            </button>
            <a
              className="author-controls__tweet-it button"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${title}\n\nWritten on longtweet: https://longtweet.io/${postId}`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Tweet
            </a>
          </div>
        </div>
        {title && <h1 className="title">{title}</h1>}
        <p className="caption">
          <span>
            — by{' '}
            <a
              href={`https://twitter.com/${encodeURIComponent(handle)}`}
              target="_blank"
              rel="noreferrer"
            >
              @{handle}
            </a>
            ,
          </span>
          &nbsp;
          <span data-created-data={createdDate} id="created-date">
            {createdDate}
          </span>
        </p>
        <article dangerouslySetInnerHTML={{ __html: md.render(text, {}) }} />
      </main>
      <Footer />
    </UserProvider>
  );
}

export default Post;
