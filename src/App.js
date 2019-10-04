import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Palette from './Palette';
import PaletteList from './PaletteList';
import SingleColorPalette from './SingleColorPalette';
import Page from './Page';
import seedColors from './seedColors';
import NewPaletteForm from './NewPaletteForm';
import { generatePalette } from './colorHelpers';


class App extends Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = { palettes: savedPalettes || seedColors }
    this.savePalette = this.savePalette.bind(this);
    this.findPalette = this.findPalette.bind(this);
    this.deletePalette = this.deletePalette.bind(this);
  };
  findPalette(id) {
    return this.state.palettes.find(function(palette) {
      return palette.id === id;
    });
  };
  deletePalette(id) {
    this.setState(
      st => ({ palettes: st.palettes.filter(palette => palette.id !== id)}),
      this.syncLocalStorage
    );
  };
  savePalette(newPalette) { /* newPalette object*/
    this.setState({
      palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  };
  syncLocalStorage() {
    // save paletes to local storage
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  };
  render() {
    return (
      <Route render={({ location }) => ( // this one route that always renders, location from props, each location has a key
        <TransitionGroup>
          <CSSTransition key={location.key} classNames="page" timeout={500}>
            <Switch location={location}>
              <Route 
                exact path="/palette/new" 
                render={routeProps => (
                  <Page> {/** This is in orde for the transition to affect route and not individual elements, like <drawer /> */}
                    <NewPaletteForm
                      savePalette={this.savePalette}
                      palettes={this.state.palettes} // have access to all the palettes in the props
                      {...routeProps}
                    /> 
                  </Page>
                )}
              />
              <Route 
                exact path="/palette/:paletteId/:colorId" 
                render={routeProps => (
                  <Page>
                    <SingleColorPalette 
                      colorId={routeProps.match.params.colorId}
                      palette={generatePalette(this.findPalette(routeProps.match.params.paletteId))}
                    />
                   </Page> 
                )}
              />
              <Route 
                exact path="/" 
                render={routeProps => ( // routeProps passes things down like history
                  <Page>
                    <PaletteList 
                      palettes={this.state.palettes} 
                      deletePalette={this.deletePalette} 
                      {...routeProps}
                    />
                  </Page>
                )}
              />
              <Route 
                exact path="/palette/:id"  
                render={routeProps => (
                  <Page>
                    <Palette 
                      palette={generatePalette(
                        this.findPalette(routeProps.match.params.id))}
                    />
                  </Page>
                )} 
              />
              <Route // this catches any other routes not specified
                render={routeProps => (
                  <Page>
                    <PaletteList
                      palettes={this.state.palettes}
                      deletePalette={this.deletePalette}
                      {...routeProps}
                    />
                  </Page>
                )}
              />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        )} 
      />
    );
  }
}

export default App;

//altered it to be class instead of a function,can alter it back if necessary
