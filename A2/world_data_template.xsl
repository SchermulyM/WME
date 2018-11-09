<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Country</th>
                    <th>Birth Rate / 1000</th>
                    <th>Cell Phones / 100</th>
                    <th>Children / Woman</th>
                    <th>Electricity Cons. / Capita</th>
                    <th>GDP / Capita</th>
                </tr>
            </thead>
            <tbody id="table_body">
                <xsl:for-each select="Countries/Country">
                    <tr>
                        <td>
                            <xsl:value-of select="id"/>
                        </td>
                        <td>
                            <xsl:value-of select="name"/>
                        </td>
                        <td>
                            <xsl:value-of select="birth_rate_per_1000"/>
                        </td>
                        <td>
                            <xsl:value-of select="cell_phones_per_100"/>
                        </td>
                        <td>
                            <xsl:value-of select="children_per_woman"/>
                        </td>
                        <td>
                            <xsl:value-of select="electricity_consumption_per_capita"/>
                        </td>
                        <td>
                            <xsl:value-of select="gdp_per_capita"/>
                        </td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>

</xsl:stylesheet>