import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from './styles/MiniPaletteStyles';

// functions are stateless components
class MiniPalette extends PureComponent{ // enavbles accessing of a components props this.props
	/** Pure component means it's not rerendering every single time something changes in 
	 * the parent state because these aren't changing */
	constructor(props) {
		super(props);
		this.deletePalette = this.deletePalette.bind(this);
		this.handleClick = this.handleClick.bind(this);
	};
	deletePalette(e) {
		e.stopPropagation(); // stops the link
		this.props.openDialog(this.props.id);
	};
	handleClick() {
		this.props.goToPalette(this.props.id);
	}
	render(){
		const { classes, paletteName, emoji, colors } = this.props; // this.props only occurs in classesnot functions
		console.log("Rendering", paletteName);
		const miniColorBoxes = colors.map(color => (
			<div 
				className={classes.miniColor}
				style={{ backgroundColor: color.color }} 
				key={color.name}
			/>
		));
		return (
			<div className={classes.root} onClick={this.handleClick}> {/**this adds the style to the particular element */}
					<DeleteIcon 
						className={classes.deleteIcon} 
						style={{ transition: "all 0.3s ease-in-out"}}
						onClick={this.deletePalette}
					/>
				<div className={classes.colors}>{miniColorBoxes}</div>
				<h5 className={classes.title}>
					{paletteName} <span className={classes.emoji}>{emoji}</span> 
				</h5>
			</div>
		);
	}
}

export default withStyles(styles)(MiniPalette);
//known as a higher order component
