import React, { Component } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { ChromePicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './styles/ColorPickerFormStyles';

class ColorPickerForm extends Component {
  constructor(props) {
    super(props);
    this.state = { currentColor: "teal", newColorName: "" };
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };  
  componentDidMount() {
    ValidatorForm.addValidationRule("isColorNameUnique", value =>
      this.props.colors.every( ({name}) => name.toLowerCase() !== value.toLowerCase())
        /* every single thing in this.state.color has a name(when lowercase) not equal
        to the value input(in lowercase) */
    );
    ValidatorForm.addValidationRule("isColorUnique", value => 
      this.props.colors.every( ({ color }) => color !== this.state.currentColor )
    );
  };
  updateCurrentColor = (newColor) => {
    this.setState({ currentColor: newColor.hex });
  };
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit() {
    const newColor = {
      color: this.state.currentColor,
      name: this.state.newColorName
    };
    this.props.addNewColor(newColor); // passing this through
    this.setState({ newColorName: "" });
  }
  render() {
    const { paletteIsFull, classes } = this.props;
    const { currentColor, newColorName } = this.state;
    return (
      <div>
        <ChromePicker
            color={currentColor} 
            onChangeComplete={ this.updateCurrentColor }
            className={classes.picker}
          />
          <ValidatorForm 
            onSubmit={this.handleSubmit} 
            ref="form" 
            instantValidate={false} // this stops immediate validation until submit is clicked
          >
            <TextValidator 
              value={newColorName}
              className={classes.colorNameInput}
              placeholder="Colour Name"
              name="newColorName" 
              variant="filled"
              margin="normal"
              onChange={this.handleChange}
              validators={["required", "isColorNameUnique", "isColorUnique"]} 
              errorMessages={["Enter a colour name", "Colour name must be unique", "Colour already used"]}
            />
            <Button 
              variant="contained"
              type="submit"
              color="primary" 
              disabled={paletteIsFull}
              className={classes.addColor}
              style={{ backgroundColor: paletteIsFull ? "grey" : currentColor }}
            >
              {paletteIsFull ? "Palette is Full" : "Add Colour"}
            </Button>
          </ValidatorForm>
      </div>
    )
  }
}

export default withStyles(styles)(ColorPickerForm);
