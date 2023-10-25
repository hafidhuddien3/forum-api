class EntityGotThreadById {
    constructor(thread, comments) {  
      comments.forEach(n => {
        if (n.is_delete=='yes'){
          n.content='**komentar telah dihapus**';
        }      
      });
      const mapComment = comments.map((n) => ({
        id: n.id,
        username: n.username,
        date: n.date,
        content: n.content,
      }));

      this.id= thread.id,
      this.title= thread.title,
      this.body= thread.body,
      this.date= thread.date,
      this.username= thread.username,
      this.comments= mapComment;

    }
    
  }
  
  module.exports = EntityGotThreadById;
  