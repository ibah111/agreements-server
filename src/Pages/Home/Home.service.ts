import { NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Paper } from '../../Modules/LocalDatabase/Models/Paper';
import { AddPost, EditPost } from './Home.input';
export class HomeService {
  constructor(@InjectModel(Paper) private readonly modelPaper: typeof Paper) {}

  async addPost({ data }: { data: AddPost }) {
    const newPost = await this.modelPaper.create({ ...data });
    console.log('Пост написан и создан');
    return newPost;
  }
  async editPost(data: EditPost) {
    const name = await this.modelPaper.update(
      {
        [data.name]: data.text,
      },
      { where: { id: data.text } },
    ); // &&&&&&&&&&
    console.log('Пост отредкатирован');
    return true;
  }
  async deletePost(id: number) {
    const Post = await this.modelPaper.findByPk(id);
    if (Post) {
      console.log('Пост удален');
      return Post.destroy();
    } else {
      throw new NotFoundException('Пост не существует. Удалять нечего');
    }
  }
}
