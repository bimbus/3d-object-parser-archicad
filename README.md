# ArchiCAD file parser

Use your GSM file as templates and parse data from MDM like Akeneo PIM.

This is an attempt at merging the data for a piece of furniture coming from a PIM to an ArchiCAD GSM File in order to generate a revised version everytime the data changes and keep 3D object libraries up-to-date.

The architecture is as follows :

Akeneo PIM -> change event -> Message publishing in MQ (here Google Pub/Sub) -> Node listener on a Windows Machine -> Data retrieval and parsing -> New GSM file version saved.

Feel free to fork and amend.
