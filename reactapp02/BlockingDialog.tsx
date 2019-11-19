import * as React from "react";
import { render } from 'react-dom';

import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import { DefaultButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { ComboBox, IComboBoxOption, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index';
import { Slider } from 'antd';
import { Row, Col } from 'antd';

import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import Konva from 'konva';

export interface IBlockingDialogProps {
    xValue?: number;
    xValueChanged?: (newValue: number) => void;

    yValue?: number;
    yValueChanged?: (newValue: number) => void;

}

export interface IBlockingDialogState extends React.ComponentState, IBlockingDialogProps {
    controlSize: number;
    imagesFadeIn: boolean;
    hideDialog: boolean;
    isDraggable: boolean;
}
  
export class BlockingDialog extends React.Component<IBlockingDialogProps, IBlockingDialogState> {
    constructor(props: IBlockingDialogProps) {
        super(props);
    
        this.state = {
          xValue: props.xValue || 0,
          yValue: props.yValue || 0,
          imagesFadeIn: true,
          controlSize: 100,
          hideDialog: true, 
          isDraggable: false 
        };
    }

    private _dragOptions = {
        moveMenuItemText: 'Move',
        closeMenuItemText: 'Close',
        menu: ContextualMenu
    };

    public componentWillReceiveProps(newProps: IBlockingDialogProps): void {
        this.setState(newProps);
    }

    public render(): JSX.Element {


        const { hideDialog, isDraggable, numberOfThings, controlSize } = this.state;

        const { xValue, yValue } = this.state;
        const styleSliderVertical = {
          display: 'inline-block',
          height: 300,
        };
        const styleSliderHorizontal = {
          display: 'inline-block',
          width: 300,
          marginBottom: 10,
        };

        let displayValueX : number = xValue ? xValue * 3 : 0;
        let displayValueY : number = yValue ? (100 - yValue) * 3 : 0;

        let startPointY : number = 0;
        let startPointX : number = 0;


        if (displayValueX >= 150 && displayValueY <= 150) {
          startPointY = 0;
          startPointX = 150;
        }
        else if (displayValueX >= 150 && displayValueY >= 150){
          startPointY = 150;
          startPointX = 150;
        }
        else if (displayValueX <= 150 && displayValueY >= 150){
          startPointY = 150;
          startPointX = 0;
        }
        return (
            <div>




              <Checkbox label="Is draggable" onChange={this._toggleDraggable} checked={isDraggable} />
              <DefaultButton secondaryText="Opens the Sample Dialog" onClick={this._showDialog} text="Rate Subject" />
              <Dialog
                maxWidth={850}
                hidden={hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                  type: DialogType.normal,
                  title: 'Please rate your subject',
                  subText: 'How would you rate X and Y?'
                }}
                modalProps={{
                  isBlocking: true,
                  styles: { main: { maxWidth: 850 } },
                  dragOptions: isDraggable ? this._dragOptions : undefined
                }}
                >

                <Row align="bottom" type="flex" >
                <Col span={2}><div style={styleSliderVertical}><Slider min={0} max={100} defaultValue={yValue} vertical onChange={this._sliderChangeY}  /></div></Col>
                <Col span={22}><Stage width={300} height={300}>
                      <Layer>
                              <Rect x={0} y={0} width={300} height={300} fill="#f0f0f0" />

                              <Rect x={startPointX} y={startPointY} width={150} height={150} fill="#e0e0e0" />


                              <Line points={[0, 150, 300, 150]} stroke="#d0d0d0" tension={1} />
                              <Line points={[150, 0, 150, 300]} stroke="#d0d0d0" tension={1} />
                    
                              <Circle x={displayValueX} y={displayValueY} radius={10} fill="#997799" />
                              <Circle x={displayValueX} y={displayValueY} radius={9} fill="#fff" />
                              
                              <Circle x={displayValueX} y={displayValueY} radius={5} fill="#997799" />
                              

                      </Layer>
                    </Stage></Col></Row>    
              <Row align="bottom" type="flex" justify="end" >
                <Col span={2}></Col>
                <Col span={22}><div style={styleSliderHorizontal}><Slider min={0} max={100} defaultValue={xValue}  onChange={this._sliderChangeX} /></div></Col>
              </Row>                   


                <DialogFooter>
                  <PrimaryButton onClick={this._closeDialog} text="Ok" />
                </DialogFooter>
              </Dialog>
            </div>
        );
      }
    
      private _sliderChangeX = (value: any ): void => {
        this.setState({ xValue: value });
        
        if(this.props.xValueChanged)
          this.props.xValueChanged(value) ; 

        console.log('onChange: ', value);
      };

      private _sliderChangeY = (value: any ): void => {
        //this.setState({ xValue: value });
        this.setState({ yValue: value });

        if(this.props.yValueChanged)
         this.props.yValueChanged(value) ; 

        console.log('onChange: ', value);
      };


      private _showDialog = (): void => {
        this.setState({ hideDialog: false });
      };
    
      private _closeDialog = (): void => {
        this.setState({ hideDialog: true });
      };
    
      private _toggleDraggable = (): void => {
        this.setState({ isDraggable: !this.state.isDraggable });
      };

}