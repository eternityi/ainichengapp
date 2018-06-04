import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from "react-native-popup-menu";
const { SlideInMenu } = renderers;

const { width,height } = Dimensions.get('window');

class CustomSlideMenu extends Component {
  render() {
  	let { selectHandler= value => {console.log('onSelect:'+value)},height=height*0.6,triggerComponent,menuRef=null } = this.props
    return (
      <Menu onSelect={selectHandler} renderer={SlideInMenu} ref={menuRef}>
        <MenuTrigger
          customStyles={{ TriggerTouchableComponent: TouchableWithoutFeedback }}
        >
          {triggerComponent}
        </MenuTrigger>
        <MenuOptions customStyles={{
	        optionsWrapper: {
	    		height
	  		}
  		}}>
          {
          	this.props.children
          }
        </MenuOptions>
      </Menu>
    );
  }
}

const styles = StyleSheet.create({

});


export default CustomSlideMenu;