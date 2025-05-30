import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto, id: string) {
    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        pages: dto.pages,
        author: dto.author,
        genre: dto.genre,
        userId: id,
      }
    });

    return book;
  }
  
  async findAll() {
    const books = await this.prisma.book.findMany();
    return books;
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where:{
        id: id,
      }
    });

    if (!book) 
      throw new NotFoundException('Book not found.');
    
    return book;
  }

  async update(id: string, dto: UpdateBookDto, userid: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    if (book.userId !== userid) {
      throw new ForbiddenException('You do not have permission to update this book.');
    }

    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: dto,
    });

    return updatedBook;
  }

  async remove(id: string, userid: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    if (book.userId !== userid) {
      throw new ForbiddenException('You do not have permission to delete this book.');
    }

    await this.prisma.book.delete({
      where: { id },
    });

    const books = await this.prisma.book.findMany();
    return books;
  }
}
