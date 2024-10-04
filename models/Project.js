    import mongoose from 'mongoose';

    const ProjectSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
      },
      priorityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
      },
      budget: {
        type: Number,
        min: 0
      },
      fileUpload: {
        type: String,
        trim: true
      },
      riskAssessment: {
        type: String,
        trim: true
      },
      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      team_members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }],
      reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
      }]
    }, {
      timestamps: true
    });

    const Project = mongoose.model('Project', ProjectSchema);

    export default Project;