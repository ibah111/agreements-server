import { NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Paper } from '../../Modules/LocalDatabase/Models/Paper';
import { AddPostInput, EditPostInput } from './Post.input';
export class PostService {
  GetPost(index: number) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(Paper) private readonly modelPaper: typeof Paper) {}

  async addPost({ data }: { data: AddPostInput }) {
    const newPost = await this.modelPaper.create({ ...data });
    console.log('Пост написан и создан');
    return newPost;
  }
  async editPost(data: EditPostInput) {
    const name = await this.modelPaper.update(
      {
        [data.name]: data.text,
      },
      { where: { id: data.text } },
    );
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
  async getPost(id: number) {
    const user = await this.modelPaper.findByPk(id);
    if (user) {
      console.log('Пост найден');
      return user;
    } else {
      throw new NotFoundException('Пост не найден🙃');
    }
  }
}
