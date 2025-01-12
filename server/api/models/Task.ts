import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  taskType: 'preparation' | 'delivery';
  mealType: 'morning' | 'afternoon' | 'night';
  patientId: Schema.Types.ObjectId;
  dietChartId: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
}

const taskSchema = new Schema({
  taskType: { 
    type: String, 
    required: true, 
    enum: ['preparation', 'delivery'] 
  },
  mealType: { 
    type: String, 
    required: true, 
    enum: ['morning', 'afternoon', 'night'] 
  },
  patientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  dietChartId: { 
    type: Schema.Types.ObjectId, 
    ref: 'DietChart', 
    required: true 
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);