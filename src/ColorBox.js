import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import styles from './styles/ColorBoxStyles';

class ColorBox extends Component {
  constructor(props) {
    super(props);
    this.state = { copied: false }; // some boolean true or false
    this.changeCopyState = this.changeCopyState.bind(this);
  }
  changeCopyState() {
    this.setState({ copied: true }, () => { //sets it to be true
      setTimeout(() => this.setState({ copied: false }), 1500);
    }); // 1500 ms later sets it to be false
  }
  render() {
    const { name, background, moreUrl, showingFullPalette, classes } = this.props;
    const { copied } = this.state;
    return (
      <CopyToClipboard text={background} onCopy={this.changeCopyState}>
        <div style={{ background }} className={classes.colorBox}>
          <div 
            style={{ background }} /*className={`${classes.copyOverlay} ${copied && classes.showOverlay}`} /* if copied if true add class show */
            className={classNames(classes.copyOverlay, { // equiv. to above
              [classes.showOverlay]: copied
            })}
          />
          <div className={classNames(classes.copyMessage, { // className={`${classes.copyMessage} ${copied && classes.showMessage}`
              [classes.showMessage]: copied
            })}
            >
            <h1>copied!</h1>
            <p className={classes.copyText}>{background}</p>
          </div>
          <div>
            <div className={classes.boxContent}>
              <span className={classes.colorName}>{name}</span>
            </div>
            <button className={classes.copyButton}>Copy</button>
          </div>
          {showingFullPalette && 
            <Link 
              to={moreUrl} 
              onClick={e => e.stopPropagation()} /** event => means this is the end of the road don't fire the parent i.e. copy */>
              <span className={classes.seeMore}>More</span>
            </Link>
          }
        </div>
      </CopyToClipboard>
    );
  }
}

export default withStyles(styles)(ColorBox);

    /* const isDarkColor = chroma(background).luminance() <= 0.08,
    const isLightColor = chroma(background).luminance() >= 0.7, */
