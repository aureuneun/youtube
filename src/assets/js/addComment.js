import axios from "axios";

const addCommentForm = document.querySelector(".add__comment");
const commentInput = document.querySelector("input[name='comment']");
const commentList = document.querySelector(".video__comments-list");
const CommentNumber = document.querySelector(".video__comment-number");
const deleteCommnets = document.querySelectorAll(".delete__comment");

const removeComment = async (commentId) => {
  const id = window.location.href.split("/videos/")[1];
  const res = await axios({
    url: `/api/${id}/remove`,
    method: "post",
    data: { commentId },
  });
  const {
    data: { length },
  } = res;
  CommentNumber.innerHTML =
    length === 1 ? `${length} comment` : `${length} comments`;
};

const handleDeleteComment = (e) => {
  const {
    target: { parentNode },
  } = e;
  commentList.removeChild(parentNode);
  removeComment(parentNode.id);
};

const addComment = (res) => {
  const {
    data: { newComment, length },
  } = res;
  const li = document.createElement("li");
  const span = document.createElement("span");
  const btn = document.createElement("div");
  span.innerHTML = newComment.text;
  btn.innerHTML = "❌";
  span.classList.add("text__comment");
  btn.classList.add("delete__comment");
  li.id = newComment._id;
  btn.addEventListener("click", handleDeleteComment);
  li.appendChild(span);
  li.appendChild(btn);
  commentList.prepend(li);
  CommentNumber.innerHTML =
    length === 1 ? `${length} comment` : `${length} comments`;
};

const sendComment = async (comment) => {
  const id = window.location.href.split("/videos/")[1];
  const res = await axios({
    url: `/api/${id}/comment`,
    method: "post",
    data: { comment },
  });
  if (res.status == 200) addComment(res);
};

const handleCommentSubmit = (e) => {
  e.preventDefault();
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const addCommentInit = () => {
  addCommentForm.addEventListener("submit", handleCommentSubmit);
  deleteCommnets.forEach((comment) => {
    comment.addEventListener("click", handleDeleteComment);
  });
};

if (addCommentForm) {
  addCommentInit();
}
