import OpenAI from 'openai';

export class BookService {
constructor(
private prisma: PrismaService,
private config: ConfigService,
private openai: OpenAI
) {
const apiKey = this.config.get('OPENAI_API_KEY'); // Assuming you're storing the API key in an environment variable
this.openai = new OpenAI({
apiKey: apiKey,
});
}

// Your methods here...
}

async generateSummary(id: number, chapterId?: number): Promise<{ chapterId?: number; bookTitle?: string; summary: string }> {
const book = await this.prisma.book.findUnique({
where: { id },
include: { chapters: true },
});

    if (!book) {
      throw new Error('Book not found');
    }

    let summaryText;
    if (chapterId) {
      // Get specific chapter content
      const chapter = book.chapters.find(c => c.id === chapterId);
      if (!chapter) {
        throw new Error('Chapter not found');
      }
      summaryText = chapter.content;
    } else {
      // Get all chapters' content
      summaryText = book.chapters.map(chapter => chapter.content).join(' ');
    }

    const response = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: `Summarize the following text: ${summaryText}` }],
      model: "gpt-3.5-turbo",
    });

    const summary = response.choices[0].content.trim(); // Access generated text directly

    if (chapterId) {
      return { chapterId, summary };
    } else {
      return { bookTitle: book.title, summary };
    }

}
