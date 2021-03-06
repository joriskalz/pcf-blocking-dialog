import {IInputs, IOutputs} from "./generated/ManifestTypes";

// React
import * as React from "react";
import * as ReactDOM from "react-dom";

// React Control and State Props
import { BlockingDialog, IBlockingDialogProps } from "./BlockingDialog";


export class reactapp02 implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	  // reference to the notifyOutputChanged method
	  private notifyOutputChanged: () => void;
	  // reference to the container div
	  private theContainer: HTMLDivElement;
	  // reference to the React props, prepopulated with a bound event handler
	  private props: IBlockingDialogProps = {
		xValueChanged: this.xValueChanged.bind(this),
		yValueChanged: this.yValueChanged.bind(this)
	  };

	  
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this.notifyOutputChanged = notifyOutputChanged;
		this.props.xValue = context.parameters.xValue.raw || 0;
		this.props.yValue = context.parameters.yValue.raw || 0;
		this.theContainer = container;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (context.updatedProperties.includes("xValue"))
			this.props.xValue = context.parameters.xValue.raw || 0;

		if (context.updatedProperties.includes("yValue"))
			this.props.yValue = context.parameters.yValue.raw || 0;

		// Render the React component into the div container
		ReactDOM.render(
		// Create the React component
		React.createElement(
			BlockingDialog, // the class type of the React component found in Facepile.tsx
			this.props
		),
		this.theContainer
		);
	}

	/**
   * Called by the React component when it detects a change in the number of faces shown
   * @param newValue The newly detected number of faces
   */
	private xValueChanged(newValue: number) {
		// only update if the number of faces has truly changed
		if (this.props.xValue !== newValue) {
		this.props.xValue = newValue;
		this.notifyOutputChanged();
		}
	}

		/**
   * Called by the React component when it detects a change in the number of faces shown
   * @param newValue The newly detected number of faces
   */
  private yValueChanged(newValue: number) {
	// only update if the number of faces has truly changed
	if (this.props.yValue !== newValue) {
	this.props.yValue = newValue;
	this.notifyOutputChanged();
	}
}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			xValue: this.props.xValue,
			yValue: this.props.yValue
		  };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this.theContainer);
	}
}