import React, { useState, useEffect } from 'react';
import usePull from 'use-pull';
import PaperPlane from './paper-plane';
import { Redirect } from './router';
import { useUser } from './user';
import { getToken } from '../helpers/auth';
import CircleNotch from './circle-notch';
import fetch from '../helpers/wrapped-fetch';

function Compose() {
  const user = useUser();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [autoResize, setAutoResize] = useState(true);
  const [loading, setLoading] = useState(false);

  const getTitle = usePull(title);
  const getText = usePull(text);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const title = getTitle();
      const text = getText();

      if (title || text) {
        // Cancel the event as stated by the standard.
        e.preventDefault();
        // Chrome requires returnValue to be set.
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, [getTitle, getText]);

  if (!user.loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <input
        className="title title-input"
        type="text"
        placeholder="Title"
        autoFocus
        defaultValue=""
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <p className="caption">
        <sup>*</sup>For <em>really</em> long posts, we advise you to copy/paste
        from Google Docs or something.
        <br />
        {user.handle && (
          <>
            <span className="emoji">👋</span> Writing as{' '}
            <a
              href={`https://twitter.com/${user.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              @{user.handle}
            </a>
          </>
        )}
      </p>
      <p>
        <label className="caption auto-resize">
          <div>Auto resize</div>&nbsp;
          <input
            type="checkbox"
            checked={autoResize}
            onChange={() => setAutoResize(!autoResize)}
          />
        </label>
      </p>
      <textarea
        className="post-textarea"
        placeholder="Write your post…"
        onChange={(e) => {
          const { currentTarget } = e;
          setText(currentTarget.value);
          if (autoResize) {
            currentTarget.style.minHeight = '1px';
            currentTarget.style.minHeight = e.currentTarget.scrollHeight + 'px';
          }
        }}
      />
      {text.length > 300000 && (
        <p className="caption">
          To prevent this platform from being abused, we limit posts to 300,000
          characters (roughly 100 single-spaced pages)
        </p>
      )}
      <button
        className="compose-button"
        disabled={!text || text.length > 300000 || loading}
        onClick={async () => {
          setLoading(true);
          if (!window.confirm('Are you sure want to post this?')) {
            setLoading(false);
            return;
          }

          try {
            const response = await fetch('/create-post', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title, text }),
            });

            if (!response.ok) {
              throw new Error();
            }

            const { id } = await response.json();
            window.location.href = `/${id}`;
          } catch {
            alert("We're sorry. Something went wrong.");
            setLoading(false);
          }
        }}
      >
        <span>Post</span>
        {loading ? <CircleNotch /> : <PaperPlane />}
      </button>
    </>
  );
}

export default Compose;
