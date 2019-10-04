import React, { Component } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Picker } from 'emoji-mart';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import 'emoji-mart/css/emoji-mart.css';

class PaletteMetaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: "form",
      newPaletteName: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.showEmojiPicker = this.showEmojiPicker.bind(this);
    this.savePalette = this.savePalette.bind(this);
  };
  componentDidMount() {
    ValidatorForm.addValidationRule("isPaletteNameUnique", value =>
    this.props.palettes.every( ({ paletteName }) => 
      paletteName.toLowerCase() !== value.toLowerCase())
    );
  };
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  };
  showEmojiPicker() {
    this.setState({ stage: "emoji" });
  };
  savePalette(emoji) {
    const newPalette = {
      paletteName: this.state.newPaletteName,
      emoji: emoji.native
    };
    this.props.handleSubmit(newPalette);
    this.setState({ stage: "" });
  }
  handleClickOpen = () => { // event handlers using class properties
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { newPaletteName, stage } = this.state;
    const { hideForm } = this.props;

    return (
      <div>
        <Dialog
          open={stage === "emoji"}
          onClose={hideForm}
        >
          <DialogTitle id='form-dialog-title'>Choose a Palette Emoji</DialogTitle>
          <Picker 
            title="Pick a palette emoji"
            onSelect={this.savePalette}
          />
        </Dialog>
        <Dialog 
          open={this.state.stage === "form"} 
          onClose={hideForm} // was this.handleClose, new method calling enables repeated cancelling of form and beiong able to open save dialog again
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Choose a palette name</DialogTitle>
          <ValidatorForm 
            onSubmit={this.showEmojiPicker}
          >
            <DialogContent>
              <DialogContentText>
                Please click "save palette" if inded you want to "save your palette", if not I'm not sure why you're here...
              </DialogContentText>
              <TextValidator
                label="Palette Name"
                value={newPaletteName}
                name="newPaletteName"
                onChange={this.handleChange}
                fullWidth
                margin="normal"
                validators={["required", "isPaletteNameUnique"]}
                errormessage={["Enter Palette Name", "Name already used"]}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={hideForm} // hideForm method being passed down in props form parent
                color="primary"
              > 
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="sumbit">
                Save Palette
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}

export default PaletteMetaForm;
