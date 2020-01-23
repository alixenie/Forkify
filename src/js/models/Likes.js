export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const likeItem = {
            id,
            title,
            author,
            image
        }
        this.likes.push(likeItem);
        this.persistData();

        return likeItem;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id == id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id == id) != -1;
    }

    getNumOfLikes() {
        return this.likes.length;        
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}