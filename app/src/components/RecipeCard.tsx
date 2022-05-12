import { Recipe } from "../types/types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAtom } from "jotai";
import { tokenAtom } from "../App";

interface RecipeProps {
  recipe: Recipe;
  getRecipes: Function;
}

interface StepsProp {
  steps: Array<string>;
}

interface IngredientsProp {
  ingredients: Array<string>;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function RecipeCard({ recipe, getRecipes }: RecipeProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const [token] = useAtom(tokenAtom);

  const RecipeSteps = ({ steps }: StepsProp) => (
    <div>
      <Typography variant="h5">Steps</Typography>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );

  const RecipeIngredients = ({ ingredients }: IngredientsProp) => (
    <div>
      <Typography variant="h5">Ingredients</Typography>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );

  const goToAddPage = () => {
    navigate(`/recipes/${recipe._id}`);
  };

  const deleteRecipe = async () => {
    await axios.delete(`/api/recipes/${recipe._id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    getRecipes();
  };

  return (
    <Card key={recipe._id} sx={{ maxWidth: 345, minHeight: 350 }}>
      <CardHeader title={recipe.name} />
      {recipe.imageUrl ? (
        <CardMedia height="190" component="img" image={recipe.imageUrl} />
      ) : null}
      <CardContent>
        <Collapse in={expanded}>
          <RecipeIngredients ingredients={recipe.ingredients} />
          <RecipeSteps steps={recipe.steps} />
        </Collapse>
      </CardContent>
      <CardActions disableSpacing>
        <Button size="small" color="primary" onClick={goToAddPage}>
          Add to Grocy
        </Button>
        <Button size="small" color="primary" onClick={deleteRecipe}>
          Delete
        </Button>
        <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)}>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
}
