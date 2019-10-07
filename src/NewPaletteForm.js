import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import { withStyles} from '@material-ui/core/styles';
import classNames from "classnames";
import PaletteFormNav from './PaletteFormNav';
import ColorPickerForm from './ColorPickerForm';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import DraggableColorList from './DraggableColorList';
import seedColors from './seedColors';
import styles from './styles/NewPaletteFormStyles';

class NewPaletteForm extends Component {
  static defaultProps = {
    maxColors: 20
  };
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      colors: seedColors[0].colors /** this.props.palettes[0].colors - referes to the seedcolors palette */
    };
    this.addNewColor = this.addNewColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
    this.removeColor = this.removeColor.bind(this);
    this.clearColors = this.clearColors.bind(this);
    this.addRandomColor = this.addRandomColor.bind(this);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  addNewColor(newColor) {
    this.setState({ 
      colors: [...this.state.colors, newColor],
      newColorName: "" 
    });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  };

  clearColors() {
    this.setState({ colors: [] });
  };

  addRandomColor() {
    // pick random colour from palettes stored
    /*const allColors = this.props.palettes.map(p => p.colors).flat(); //makes one array
    let rand = Math.floor(Math.random() * allColors.length);
    const randColor = allColors[rand];
    this.setState({ colors: [...this.state.colors, randColor] || [randColor]}); */

    const allColors = this.props.palettes.map(p => p.colors).flat();
    let rand;
    let randColor;
    let isDuplicateColor = true;
    while (isDuplicateColor) {
      rand = Math.floor(Math.random() * allColors.length);
      randColor = allColors[rand];
      isDuplicateColor = this.state.colors.some(
        // eslint-disable-next-line
        color => color.name === randColor.name
      );
    }
    this.setState({ colors: [...this.state.colors, randColor] || [randColor]});
  }

  handleSubmit(newPalette) {
    newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, "-");
    newPalette.colors = this.state.colors;
    this.props.savePalette(newPalette);
    this.props.history.push("/");
  };

  removeColor(colorName) {
    this.setState({
      colors: this.state.colors.filter(color => color.name !== colorName)
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ colors }) => ({
      colors: arrayMove(colors, oldIndex, newIndex)
    }));
  };

  render() {
    const { classes, maxColors, palettes } = this.props;
    const { open, colors } = this.state;
    const paletteIsFull = colors.length >= maxColors;

    return (
      <div className={classes.root}>
        <PaletteFormNav 
          open={open} 
          palettes={palettes}
          handleSubmit={this.handleSubmit}
          handleDrawerOpen={this.handleDrawerOpen}
        />
        <Drawer
          className={classes.drawer}
          variant="persistent" // dunno about this
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {<ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <div className={classes.container}>
            <Typography variant="h4" gutterBottom>Design your palette</Typography> {/* gutterBottom is similar in material ui style={{marginBottom: "0.5rem"}}*/}
            <div className={classes.buttons}>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={this.clearColors}
                className={classes.button}
              >
                Clear Palette
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={this.addRandomColor}
                disabled={paletteIsFull}
                className={classes.button}
              >
                Random colour
              </Button>
            </div>
            <ColorPickerForm 
              paletteIsFull={paletteIsFull} 
              addNewColor={this.addNewColor} 
              colors={colors}
            />
          </div>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList 
            colors={this.state.colors} 
            removeColor={this.removeColor}
            axis="xy" // enables being dragged around on x AND y axis
            onSortEnd={this.onSortEnd}  // this enables when dragging, that can drop in place
            distance={20} // amount needs to be dragged before being dragged 20px
            // props from the documents, well worth looking into when using componenets
         />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);

// const newColor = {color: this.state.currentColor, name: this.state.newColorName};