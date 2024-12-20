import React from "react";

export default function Form() {
  return (
    <div class="peoples-mesg-box">
      <div class="conversation-head">
        <figure>
          <img src="images/resources/friend-avatar.jpg" alt="" />
        </figure>
        <span>
          jason bourne <i>online</i>
        </span>
      </div>
      <ul class="chatting-area">
        <li class="you">
          <figure>
            <img src="images/resources/userlist-2.jpg" alt="" />
          </figure>
          <p>what's liz short for? :)</p>
        </li>
        <li class="me">
          <figure>
            <img src="images/resources/userlist-1.jpg" alt="" />
          </figure>
          <p>Elizabeth lol</p>
        </li>
        <li class="me">
          <figure>
            <img src="images/resources/userlist-1.jpg" alt="" />
          </figure>
          <p>wanna know whats my second guess was?</p>
        </li>
        <li class="you">
          <figure>
            <img src="images/resources/userlist-2.jpg" alt="" />
          </figure>
          <p>yes</p>
        </li>
        <li class="me">
          <figure>
            <img src="images/resources/userlist-1.jpg" alt="" />
          </figure>
          <p>Disney's the lizard king</p>
        </li>
        <li class="me">
          <figure>
            <img src="images/resources/userlist-1.jpg" alt="" />
          </figure>
          <p>i know him 5 years ago</p>
        </li>
        <li class="you">
          <figure>
            <img src="images/resources/userlist-2.jpg" alt="" />
          </figure>
          <p>coooooooooool dude ;)</p>
        </li>
      </ul>
      <div class="message-text-container">
        <form method="post">
          <textarea></textarea>
          <button title="send">
            <i class="fa fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
