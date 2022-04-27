import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  url: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: false })
  ingredients: string[];

  @Prop({ required: false })
  steps: string[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
