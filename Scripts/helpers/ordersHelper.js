define([],
function () {

    //private
    
    //public
    return {
        getColorFromPriority: function(number) {
            switch (number) {
                case -1:
                return "green";
                case 0:
                    return "none";
                case 1:
                return "red";
            }
        },
        getDirectionFromPriority: function (number) {
            var priorityDetails = { up: false, down: false, none: false }

            switch (number) {
                case -1:
                    priorityDetails.down = true;
                    break;
                case 0:
                    priorityDetails.none = true;
                    break;
                case 1:
                    priorityDetails.up = true;
                    break;
            }

            return priorityDetails;
        },
        getColorFromCompleted: function(value) {
            if (value < 30) {
                return "rgb(207, 93, 96)";
            }
            else if (value >= 30 && value < 70) {
                return "rgb(255, 198, 0)";
            }
            else if (value >= 70 && value < 100) {
                return "rgb(97, 182, 21)";
            }
            else if (value == 100) {
                return "rgb(111, 160, 217)";
            }
        },
        getClassFromStatus: function(value) {
            if (['Skipped', 'Refused', 'Audited', 'Completed'].indexOf(value) != -1) {
                return 'icon-checkmark text-blue';
            } else if (['Rework', 'Active'].indexOf(value) != -1) {
                return 'icon-clock text-green';
            } else if (value == 'Queued') {
                return 'icon-switch text-red';
            }
        },
        getPhaseStatusByServiceStatuses: function(statuses) {
            //Phase status is a min status of it's service.
            //Min is calculated by status id, 

            var cmpl = 'Completed', inpr = 'In Progress', que = 'Queued';

            if (statuses.indexOf('Skipped') != -1) {
                return cmpl;
            } else if (statuses.indexOf('Rework') != -1) {
                return inpr;
            } else if (statuses.indexOf('Refused') != -1 || statuses.indexOf('Audited') != -1 || statuses.indexOf('Completed') != -1) {
                return cmpl;
            } else if (statuses.indexOf('Active') != -1) {
                return inpr;
            } else if (statuses.indexOf('Queued') != -1) {
                return que;
            }
        }
    };
});