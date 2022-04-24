import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({required: true})
  ingredients: string[];

  @Prop({required: true})
  steps: string[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
